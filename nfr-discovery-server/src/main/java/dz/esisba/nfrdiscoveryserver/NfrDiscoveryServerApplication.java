package dz.esisba.nfrdiscoveryserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class NfrDiscoveryServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(NfrDiscoveryServerApplication.class, args);
    }

}
