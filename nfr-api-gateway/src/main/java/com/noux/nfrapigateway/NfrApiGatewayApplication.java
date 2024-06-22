package com.noux.nfrapigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class NfrApiGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(NfrApiGatewayApplication.class, args);
	}

}
