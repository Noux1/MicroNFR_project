package dz.esisba.adminservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class nfrAdminServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(nfrAdminServiceApplication.class, args);
    }
}

