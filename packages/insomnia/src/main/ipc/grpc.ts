import { ipcMain } from 'electron';

import { GrpcRequestEventEnum } from '../../common/grpc-events';
import * as grpc from '../../network/grpc';
import { GrpcIpcRequestParams } from '../../network/grpc/prepare';
import { ResponseCallbacks } from '../../network/grpc/response-callbacks';

export function registergRPCHandlers() {
  ipcMain.on(GrpcRequestEventEnum.start, (event, params: GrpcIpcRequestParams) =>
    grpc.start(params, new ResponseCallbacks(event)),
  );
  ipcMain.on(GrpcRequestEventEnum.sendMessage, (event, params: GrpcIpcRequestParams) =>
    // @ts-expect-error -- TSCONVERSION
    grpc.sendMessage(params, new ResponseCallbacks(event)),
  );
  ipcMain.on(GrpcRequestEventEnum.commit, (_, requestId) => grpc.commit(requestId));
  ipcMain.on(GrpcRequestEventEnum.cancel, (_, requestId) => grpc.cancel(requestId));
  ipcMain.on(GrpcRequestEventEnum.cancelMultiple, (_, requestIdS) =>
    grpc.cancelMultiple(requestIdS),
  );
}
