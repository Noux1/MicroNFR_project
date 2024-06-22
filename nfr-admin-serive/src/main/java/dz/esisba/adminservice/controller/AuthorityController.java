package dz.esisba.adminservice.controller;

import dz.esisba.adminservice.dto.authority.AuthorityRequest;
import dz.esisba.adminservice.dto.authority.AuthorityResponse;
import dz.esisba.adminservice.dto.role.RoleResponse;
import dz.esisba.adminservice.entity.Authority;
import dz.esisba.adminservice.service.AuthorityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/authority")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class AuthorityController {
    private final AuthorityService authorityService;
    @GetMapping("/{id}")

    @PreAuthorize("hasAuthority('AUTHORITY_VIEW_ONE')")
    public ResponseEntity<Object> getOne(@PathVariable Long id) {
        try {
            AuthorityResponse response = authorityService.getOne(id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping
    @PreAuthorize("hasAuthority('AUTHORITY_VIEW_ALL')")

    public ResponseEntity<Object> getAll() {
        try {
            List<AuthorityResponse> responses = authorityService.getAll();
            return new ResponseEntity<>(responses, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping
    @PreAuthorize("hasAuthority('AUTHORITY_CREATE')")
    public ResponseEntity<Object> createAuthority(@RequestBody AuthorityRequest request) {
        try {
            AuthorityResponse response = authorityService.create(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('AUTHORITY_UPDATE')")
    public ResponseEntity<Object> updateAuthority(@RequestBody AuthorityRequest request,
                                         @PathVariable Long id) {
        try {
            AuthorityResponse response = authorityService.update(request, id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('AUTHORITY_DELETE')")
    public ResponseEntity<Object> deleteAuthority(@PathVariable Long id) {
        try {
            authorityService.delete(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
