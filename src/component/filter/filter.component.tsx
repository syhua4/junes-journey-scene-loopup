import { Fragment, useEffect, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import {
  FilterIcon,
  MinusSmIcon,
  PlusSmIcon,
} from "@heroicons/react/solid";
import { scenes } from "../../scenes";
import GalleryComponent from "../gallery/gallery.component";

export interface IFilter {
  id: string;
  name: string;
  options: IFilterOptions[];
}

export interface IFilterOptions {
  value: string;
  label: string;
  checked: boolean;
}

export default function FilterComponent() {
  const filters: IFilter[] = [
    {
      id: "volume",
      name: "Volume",
      options: [
        { value: "Vol. 1", label: "Vol. 1", checked: true },
        { value: "Vol. 2", label: "Vol. 2", checked: false },
        { value: "Vol. 3", label: "Vol. 3", checked: false },
        { value: "Vol. 4", label: "Vol. 4", checked: false },
        { value: "Vol. 5", label: "Vol. 5", checked: false },
      ],
    },
    {
      id: "chapter",
      name: "Chapter",
      options: chapterOptions(),
    },
  ];
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [hdImage, setHdImage] = useState(false);
  const [query, setQuery] = useState("");

  const [filterCondition, setfilterCondition] =
    useState<IFilter[]>(filters);

  function getChapter(num: number) {
    const range = (start: number, stop: number, step = 1) =>
      Array(Math.ceil((stop - start) / step))
        .fill(start + 1)
        .map((x, y) => `Ch. ${x + y * step}`);
    return range(num * 10, num * 10 + 10).join();
  }

  function chapterOptions() {
    const optList = [];
    for (let i = 0; i < 10; i++) {
      const optionObj = {
        value: getChapter(i),
        label: `Chapter ${i * 10 + 1} - Chapter ${i * 10 + 10}`,
        checked: i === 0,
      };
      optList.push(optionObj);
    }

    return optList;
  }

  function getFilterCondition(event: any) {
    const { name, checked, value } = event.target;

    const filterIdx = filterCondition.findIndex((el) => el.id === name);

    const newOption = filterCondition[filterIdx].options.map((opt) => ({
      ...opt,
      ...(opt.value === value && { checked: checked }),
    }));

    const newObj: IFilter[] = JSON.parse(JSON.stringify(filterCondition));
    newObj[filterIdx].options = newOption;

    console.log(newObj);

    setfilterCondition(newObj);
  }

  function filterScenes(fromSearch?: string) {
    if (!filterCondition.length) return;

    const filteredArr = filterCondition.map((element) => {
      return {
        ...element,
        options: element.options.filter(
          (options) => options.checked === true
        ),
      };
    });

    const volumeOpt = filteredArr.find(
      (element) => element.id === "volume"
    )?.options;

    const chapterOpt = filteredArr
      .filter((cond) => {
        return cond.id === "chapter";
      })
      .flatMap((c) => {
        return c.options.map((element) => {
          return element.value.split(",");
        });
      })
      .reduce((prev, next) => prev.concat(next), []);

    let filteredVolScene = scenes.filter((scene) => {
      if (!volumeOpt?.length) return;
      return volumeOpt.find((element) => {
        return scene.volume === element.value;
      });
    });

    let filteredVolChapterScene =
      filteredVolScene.length &&
      filteredVolScene.filter((scene) => {
        if (!chapterOpt) return;
        return chapterOpt.find((element) => {
          return scene.chapter.trim() === element.trim();
        });
      });

    let setHdImage =
      (fromSearch &&
        query.length &&
        scenes.filter((scene) => scene.sceneName.includes(query))) ||
      (filteredVolChapterScene &&
        filteredVolChapterScene.map((scene) => {
          let imgLink = scene.image;
          return {
            ...scene,
            image: hdImage ? imgLink : `${imgLink}-thumb`,
          };
        }));

    console.log(setHdImage);

    return setHdImage;
  }

  function searchHandler(e: any) {
    e.preventDefault();
    console.log(query);
    filterScenes(query);
  }

  function handleChange(e: any) {
    setQuery(e.target.value);
  }

  function toggleHdImage(e: any) {
    const checked = e.target.checked;
    setHdImage(checked);
  }

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto">
                <div className="px-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Filters
                  </h2>
                  <button
                    type="button"
                    className="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters - mob */}
                <form
                  className="mt-4 border-t border-gray-200"
                  onChange={(e) => getFilterCondition(e)}
                >
                  {filterCondition.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.id}
                      className="border-t border-gray-200 px-4 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusSmIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusSmIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
                                  <input
                                    id={`filter-mobile-${section.id}-${optionIdx}`}
                                    name={`${section.id}`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    defaultChecked={option.checked}
                                    className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                    className="ml-3 min-w-0 flex-1 text-gray-500"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </form>
              </div>
            </Transition.Child>
          </Dialog>
        </Transition.Root>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 flex items-baseline justify-between pb-6 border-b border-gray-200">
            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                ></Transition>
              </Menu>

              <form onSubmit={searchHandler}>
                <div className="relative mr-6 my-2 ">
                  <input
                    type="search"
                    className="bg-purple-white shadow rounded border-0 p-3 "
                    placeholder="搜索场景编码..."
                    value={query}
                    onChange={handleChange}
                  />
                  {!query && (
                    <div className="absolute top-1 right-1 mt-3 mr-4 text-purple-lighter">
                      <svg
                        version="1.1"
                        className="h-4 text-dark"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0 0 52.966 52.966"
                      >
                        <path
                          d="M51.704,51.273L36.845,35.82c3.79-3.801,6.138-9.041,6.138-14.82c0-11.58-9.42-21-21-21s-21,9.42-21,21s9.42,21,21,21
        c5.083,0,9.748-1.817,13.384-4.832l14.895,15.491c0.196,0.205,0.458,0.307,0.721,0.307c0.25,0,0.499-0.093,0.693-0.279
        C52.074,52.304,52.086,51.671,51.704,51.273z M21.983,40c-10.477,0-19-8.523-19-19s8.523-19,19-19s19,8.523,19,19
        S32.459,40,21.983,40z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </form>
              <div
                className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
                onClick={toggleHdImage}
              >
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle"
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="toggle"
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
              <label htmlFor="toggle" className="text-xs text-gray-700">
                高清图片
              </label>
              <button
                type="button"
                className="p-2 -m-2 ml-4 sm:ml-6 text-gray-400 hover:text-gray-500 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FilterIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section
            aria-labelledby="products-heading"
            className="pt-6 pb-24"
          >
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
              {/* Filters */}
              <form
                className="hidden lg:block"
                onChange={(e) => getFilterCondition(e)}
              >
                <h3 className="sr-only">Categories</h3>

                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-b border-gray-200 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusSmIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusSmIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 text-sm text-gray-600"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                {/* Replace with your content */}
                <div className="h-96 lg:h-full">
                  <GalleryComponent
                    scenes={filterScenes(query)}
                    hd={hdImage}
                  ></GalleryComponent>
                </div>
                {/* /End replace */}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
