import { Idl } from '@coral-xyz/anchor';

// Define a type for our IDL
export type SolifyIdl = Idl & {
  metadata: {
    address: string;
  };
};
