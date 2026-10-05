import { useEffect, useRef, useState } from "react";
import type {
  CoilPairInputs,
  FieldSample,
  MapQuality,
  UniformRegion,
} from "@/types/helmholtz";

interface Job {
  id: number;
  inputs: CoilPairInputs;
  quality: MapQuality;
}
interface Result {
  id: number;
  field: FieldSample[];
  region: UniformRegion;
}
interface MapState {
  inputs: CoilPairInputs;
  quality: MapQuality;
  result: Result;
}

/** Una tarea en vuelo y solo el último pedido pendiente: un slider no acumula cola. */
export function useHelmholtzMap(inputs: CoilPairInputs, quality: MapQuality) {
  const workerRef = useRef<Worker | null>(null);
  const latest = useRef<Job | null>(null),
    running = useRef<Job | null>(null);
  const sequence = useRef(0);
  const [map, setMap] = useState<MapState | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const worker = new Worker(
      new URL("../../physics/helmholtz.worker.ts", import.meta.url),
    );
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<Result>) => {
      const completed = running.current;
      running.current = null;
      if (completed && event.data.id === latest.current?.id)
        setMap({
          inputs: completed.inputs,
          quality: completed.quality,
          result: event.data,
        });
      if (latest.current && latest.current.id !== event.data.id) {
        running.current = latest.current;
        worker.postMessage(latest.current);
      }
    };
    worker.onerror = () => {
      running.current = null;
      setError(true);
    };
    return () => {
      worker.terminate();
      workerRef.current = null;
      running.current = null;
    };
  }, []);
  useEffect(() => {
    const job = { id: ++sequence.current, inputs, quality };
    latest.current = job;
    if (workerRef.current && !running.current) {
      running.current = job;
      workerRef.current.postMessage(job);
    }
  }, [inputs, quality]);
  return {
    map,
    error,
    pending: map?.inputs !== inputs || map?.quality !== quality,
  };
}
