// threebox-plugin.d.ts

declare module "threebox-plugin" {
  // Assuming the main export is the Threebox class
  export class Threebox {
    // You can optionally add methods/properties if you know them:
    // constructor(map: any, options: any): Threebox;
  }

  // This is required if the plugin is imported as 'import Threebox from "..."'
  export default Threebox;
}
