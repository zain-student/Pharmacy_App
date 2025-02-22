import React from 'react';

export type userContextType = {
  clientSocket: any;
  refreshData: boolean;
  //Updaters
  updateclientSocket: (value: any) => void;
  startConnectionDiscovery: () => void;
};

export const UserContext = React.createContext<userContextType>({
  clientSocket: null,
  refreshData: false,
  updateclientSocket: () => {},
  startConnectionDiscovery: () => {},
});
