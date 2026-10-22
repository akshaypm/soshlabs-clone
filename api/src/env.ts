import dotenv from "dotenv";

export class EnvFiles {
  static load(): void {
    dotenv.config({ quiet: true });
  }
}
