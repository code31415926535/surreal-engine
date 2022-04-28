import AssetManager from "../managers/AssetManager";
import { ErrorWidget } from "../widgets";
import Engine, { EngineOpts } from "./engine"

/**
 * Simple way to create a new engine.
 */
export const quickStart = async (
  id: string,
  opts: EngineOpts,
  load: (assets: AssetManager) => void,
  run: (engine: Engine) => void,
  ) => {
  const engine = new Engine(id, opts);
  try {
    await engine.init();
    load(engine.assets);
    await engine.assets.load();
    engine.start();
    run(engine);
  } catch (e) {
    engine.creator.widget(ErrorWidget({ error: e as any }));
  }
}