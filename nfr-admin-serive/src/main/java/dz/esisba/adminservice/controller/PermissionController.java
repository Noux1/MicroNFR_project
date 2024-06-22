package dz.esisba.adminservice.controller;

import dz.esisba.adminservice.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/permission")
public class PermissionController {
    private final PermissionService permissionService;
    @GetMapping
    public ResponseEntity<Object> getPermissionForUser(@RequestBody String authority, @RequestBody String module ){
        try {
            return new ResponseEntity<>(permissionService.getPermissionForUser(authority, module), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
