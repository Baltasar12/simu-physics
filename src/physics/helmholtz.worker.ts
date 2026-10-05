import { sampleUniformRegion, sampleVectorField } from "./helmholtz";
import type {
  CoilPairInputs,
  MapQuality,
  UniformRegion,
} from "../types/helmholtz";

let physicalKey = "";
let uniformRegion: UniformRegion | null = null;

// El muestreo 3D corre fuera del hilo de controles/cámara. Sin IO ni recursos remotos.
self.onmessage = (
  event: MessageEvent<{
    id: number;
    inputs: CoilPairInputs;
    quality: MapQuality;
  }>,
) => {
  const { id, inputs, quality } = event.data;
  const key = JSON.stringify(inputs);
  if (key !== physicalKey || !uniformRegion) {
    uniformRegion = sampleUniformRegion(inputs);
    physicalKey = key;
  }
  self.postMessage({
    id,
    field: sampleVectorField(inputs, quality),
    region: uniformRegion,
  });
};
