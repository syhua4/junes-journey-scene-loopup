import "./App.css";
import FilterComponent from "./component/filter/filter.component";

export default function App() {
  return (
    <div className="relative bg-white ">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">🕵🏻‍♀️ June's Journey</span>
                <span
                  className="block my-4 
                text-2xl lg:text-5xl text-indigo-600 "
                >
                  场景搜索小工具 👋🏻
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 leading-loose">
                点击图片可跳转至
                <a
                  href="https://www.gamersunite.com/june-s-journey-hidden-object-mystery-game/scenes"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="underline mx-2">GamersUnite</span>✨
                </a>
                <span className="block lg:pt-2">
                  💖 手机长按图片可保存图片, 记得勾选高清图片哦!
                </span>
              </p>
            </div>
          </main>
        </div>
      </div>
      <div className="hidden lg:block lg: block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-80 lg:w-full lg:h-80"
          src="https://global-uploads.webflow.com/5eba64f02efe5d4548413f86/5eba64f02efe5de87b413fe6_JJ_Woogasite_header_2300x900_s.jpg"
          alt=""
        />
      </div>
      <FilterComponent></FilterComponent>
    </div>
  );
}
