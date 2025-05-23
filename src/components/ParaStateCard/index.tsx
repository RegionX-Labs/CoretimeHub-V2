import { Tooltip } from 'react-tooltip';
import LabelCard from '../elements/LabelCard/LabelCard';

export enum ParaState {
  RESERVED,
  ONBOARDING,
  ONDEMAND_PARACHAIN,
  IDLE_PARA,
  ACTIVE_PARA,
  ACTIVE_RENEWABLE_PARA,
  IN_WORKPLAN,
  LEASE_HOLDING,
  SYSTEM,
}

export const ParaStateCard = ({ state }: { state: ParaState }) => {
  const properties = {
    [ParaState.RESERVED]: {
      title: 'Reserved',
      background: 'orangeDark',
      tooltip: 'A parachain with a reserved para ID that is not yet registered.',
    },
    [ParaState.ONBOARDING]: {
      title: 'Onboarding',
      background: 'pinkDark',
      tooltip: 'A parachain awaiting code validation.',
    },
    [ParaState.ONDEMAND_PARACHAIN]: {
      title: 'On-Demand Parachain',
      background: 'blueDark',
      tooltip: 'Parachain that utilizes on-demand coretime.',
    },
    [ParaState.IDLE_PARA]: {
      title: 'Idle Parachain',
      background: 'greenPrimary',
      tooltip: 'A parachain currently not producing blocks.',
    },
    [ParaState.ACTIVE_PARA]: {
      title: 'Active Parachain',
      background: 'greenDark',
      tooltip: 'An active parachain that is able to produce blocks.',
    },
    [ParaState.ACTIVE_RENEWABLE_PARA]: {
      title: 'Active Parachain',
      background: 'greenDark',
      tooltip: 'An active parachain that can be renewed and is able to produce blocks.',
    },
    [ParaState.IN_WORKPLAN]: {
      title: 'Idle(In workplan)',
      background: 'cyanDark',
      tooltip: 'Parachain scheduled for execution',
    },
    [ParaState.LEASE_HOLDING]: {
      title: 'Lease Holding',
      background: 'purpleDark',
      tooltip: 'Parachain that secured coretime through the legacy slot auction model.',
    },
    [ParaState.SYSTEM]: {
      title: 'System Parachain',
      background: 'yellowDark',
      tooltip: 'Parachain responsible for core Polkadot protocol features.',
    },
  };

  const { tooltip, background, title } = properties[state];

  return (
    <>
      <div data-tooltip-id={`tooltip-${state}`} data-tooltip-content={tooltip}>
        <LabelCard label={title} color={background as any} />
      </div>
      <Tooltip id={`tooltip-${state}`} place='top' />
    </>
  );
};
