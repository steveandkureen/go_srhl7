export interface ClientModel {
  name?: string;
  ipAddresses?: string[];
  sendingPort?: string;
  listeningPort?: string;
  sendOnly?: boolean;
  clientId?: string;
  connectOnLoad?: boolean;
}
