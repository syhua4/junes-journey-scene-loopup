import { Scene } from "../../scene.modal";
import "./gallery.component.css";

import React, { memo } from "react";

export default memo(function GalleryComponent(props: any) {
  const { scenes } = props;

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {scenes &&
            scenes.map((scene: Scene, idx: number) => (
              <a
                key={idx + scene.sceneName}
                href={scene.sceneLink}
                className="group"
              >
                <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                  <img
                    src={`${scene.image}`}
                    alt={scene.sceneName}
                    className="w-full h-full object-center object-cover group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-sm font-bold text-pink-600">
                  {scene.sceneName}
                </h3>
              </a>
            ))}
        </div>
      </div>
    </div>
  );
});
