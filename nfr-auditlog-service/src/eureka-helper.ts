import { Eureka } from 'eureka-js-client';
import process from 'process';

const eurekaHost: string = process.env.EUREKA_CLIENT_SERVICEURL_DEFAULTZONE || '127.0.0.1';
const eurekaPort: number = 8761;
const hostName: string = process.env.HOSTNAME || 'localhost';
const ipAddr: string = '127.0.0.1';

interface DataCenterInfo {
    '@class': string;
    name: string;
}

interface InstanceConfig {
    app: string;
    hostName: string;
    ipAddr: string;
    port: {
        '$': number;
        '@enabled': boolean;
    };
    vipAddress: string;
    dataSideInfo: DataCenterInfo;
}

export function registerWithEureka(appName: string, port: number): void {
    const client = new Eureka({
        instance: {
            app: appName,
            hostName: hostName,
            ipAddr: ipAddr,
            port: {
                '$': port,
                '@enabled': true,
            },
            vipAddress: appName,
            dataCenterInfo: {
                '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                name: 'MyOwn',
            },
        },
        eureka: {
            host: eurekaHost,
            port: eurekaPort,
            servicePath: '/eureka/apps/',
            maxRetries: 10,
            requestRetryDelay: 2000,
        },
    });

    client.start((error: any) => {
        if (error) {
            console.error(`Failed to register with Eureka: ${error}`);
        } else {
            console.log(`${appName} service registered with Eureka.`);
        }
    });

    const exitHandler = (options: { cleanup?: boolean; exit?: boolean }, exitCode?: number) => {
        if (options.cleanup) {
            console.log('Cleanup');
        }
        if (exitCode || exitCode === 0) console.log(`Exit with code: ${exitCode}`);
        if (options.exit) {
            client.stop(() => {
                console.log('Eureka client stopped');
                process.exit();
            });
        }
    };

    process.on('SIGINT', () => exitHandler({ exit: true }));
}

