import "reflect-metadata";

import { ContainerBuilder } from "diod";
import { autoregister } from "./autoregister";

async function buildContainer() {
  const builder = new ContainerBuilder();

  await autoregister(builder);
  return builder.build();
}

export const container = await buildContainer();
