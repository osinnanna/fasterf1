declare module "*.css" {
    const content: { [className: string]: string };
    export default content;
}

declare module "*.png";
declare module "*.svg";
declare module "*.glb";
declare module "*.gltf";