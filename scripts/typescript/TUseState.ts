import { Dispatch, SetStateAction } from 'react';

type TUseState<V> = [V, Dispatch<SetStateAction<V>>];

export default TUseState;