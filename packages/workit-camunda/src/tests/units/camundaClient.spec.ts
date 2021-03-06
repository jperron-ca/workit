// Copyright (c) Ville de Montreal. All rights reserved.
// Licensed under the MIT license.
// See LICENSE file in the project root for full license information.

import { Client as CamundaExternalClient } from 'camunda-external-task-client-js';
import * as opentracing from 'opentracing';
import { CamundaBpmClient } from '../../models/camunda/camundaBpmClient';
import { Utils } from '../../models/camunda/utils';
import { CamundaClientTracer } from '../../models/core/instrumentations/camundaClientTracer';
import { Instrumentation } from '../../models/core/instrumentations/instrumentation';

let camundaClient: CamundaBpmClient;
let clientLib: { subscribe: jest.Mock<any, any>; start: jest.Mock<any, any>; stop: jest.Mock<any, any> };
describe('Camunda Client', () => {
  beforeEach(() => {
    const config = {
      maxTasks: 1,
      workerId: 'demo',
      baseUrl: `http://localhost:8080/engine-rest`,
      topicName: 'topic_demo',
      bpmnKey: 'BPMN_DEMO',
      autoPoll: false
    };

    const configuration = Utils.buildConfig(config);
    clientLib = new CamundaExternalClient(configuration);
    const noopTracer = new opentracing.Tracer();
    const ccTracer = new CamundaClientTracer(noopTracer);
    const instrumentation = new Instrumentation([ccTracer]);

    clientLib.subscribe = jest.fn().mockReturnValue(undefined);
    clientLib.start = jest.fn().mockReturnValue(undefined);
    clientLib.stop = jest.fn().mockReturnValue(undefined);
    // issue with definition - fix with any
    camundaClient = new CamundaBpmClient(configuration, clientLib as any, instrumentation);
  });

  it('should be an instance of CamundaClient', () => {
    expect(camundaClient).toBeInstanceOf(CamundaBpmClient);
  });

  it('should call subscribe and start methods', async () => {
    const onMessageReceived = jest.fn().mockResolvedValueOnce(undefined);
    await expect(camundaClient.subscribe(onMessageReceived)).resolves.toBeUndefined();
    expect(clientLib.subscribe).toBeCalledTimes(1);
    expect(clientLib.start).toBeCalledTimes(1);
    expect(clientLib.stop).not.toHaveBeenCalled();
  });

  it('should call stop method', async () => {
    await expect(camundaClient.unsubscribe()).resolves.toBeUndefined();
    expect(clientLib.stop).toBeCalledTimes(1);
    expect(clientLib.subscribe).toBeCalledTimes(0);
    expect(clientLib.start).toBeCalledTimes(0);
  });
});
