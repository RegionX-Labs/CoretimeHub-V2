import { getNetworkChainIds, getNetworkMetadata } from "@/network";
import { Network } from "@/types";
import { createEffect, createEvent, createStore, sample } from "effector";

export const potentialRenewalsRequested = createEvent<{ network: Network; connections: any }>();

type Assignment = {Task: number} | string;

type Completion = {
    Complete: Array<{
        mask: string,
        assignment: Assignment
    }>
} | { Partial: string };

type RenewalKey = {
    core: number,
    begin: number,
};

type RenewalRecord = {
    completion: Completion,
    price: bigint,
};

type PotentialRenewalsMap = Map<RenewalKey, RenewalRecord>;
export const $potentialRenewals = createStore<PotentialRenewalsMap>(new Map());

const fetchPotentialRenewals = async (
  network: Network,
  connections: any
): Promise<PotentialRenewalsMap> => {
  const chainIds = getNetworkChainIds(network);
  if (!chainIds) return new Map();

  const connection = connections[chainIds.coretimeChain];
  if (!connection || !connection.client || connection.status !== 'connected') return new Map();

  const metadata = getNetworkMetadata(network);
  if (!metadata) return new Map();

  const api = connection.client.getTypedApi(metadata.coretimeChain) as any;
  console.log('hey');

  const potentialRenewals = await api.query.Broker.PotentialRenewals.getEntries();
  let map = new Map();
  for (const entry of potentialRenewals) {
    map.set(entry.keyArgs, entry.value);
  }

  return map;
};

const potentialRenewalsFx = createEffect(
  async (payload: { network: Network; connections: any }): Promise<PotentialRenewalsMap> => {
    return fetchPotentialRenewals(payload.network, payload.connections);
  }
);

sample({
  clock: potentialRenewalsRequested,
  target: potentialRenewalsFx,
});

sample({
  clock: potentialRenewalsFx.doneData,
  target: $potentialRenewals,
});
