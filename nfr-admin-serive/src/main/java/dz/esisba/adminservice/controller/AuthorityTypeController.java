package dz.esisba.adminservice.controller;


import dz.esisba.adminservice.dto.authorityType.AuthorityTypeRequest;
import dz.esisba.adminservice.dto.authorityType.AuthorityTypeResponse;

import dz.esisba.adminservice.service.AuthorityTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.List;


@RestController
@RequestMapping("/api/v1/authorityType")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class AuthorityTypeController {
    private final AuthorityTypeService authorityTypeService;

    @GetMapping("{id}")
    @PreAuthorize("hasAuthority('AUTHORITY_TYPE_VIEW')")
    public ResponseEntity<Object> getOne(@PathVariable Long id) {
        try {
            AuthorityTypeResponse response = authorityTypeService.getOne(id);
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
    @PreAuthorize("hasAuthority('AUTHORITY_TYPE_VIEW_ALL')")

    public ResponseEntity<Object> getAll() {
        try {
            List<AuthorityTypeResponse> responses = authorityTypeService.getAll();
            return new ResponseEntity<>(responses, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping()
    @PreAuthorize("hasAuthority('AUTHORITY_TYPE_CREATE')")
    public ResponseEntity<Object> createAuthorityType(@RequestBody AuthorityTypeRequest request) {
        try {
            AuthorityTypeResponse response = authorityTypeService.create(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/{idAuthorityType}")
    @PreAuthorize("hasAuthority('AUTHORITY_TYPE_UPDATE')")
    public ResponseEntity<Object> udpateAuthorityType(@RequestBody AuthorityTypeRequest request, @PathVariable Long idAuthorityType){
        try {
            AuthorityTypeResponse response=authorityTypeService.update(request, idAuthorityType);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @DeleteMapping("/{idAuthorityType}")
    @PreAuthorize("hasAuthority('AUTHORITY_TYPE_DELETE')")
    public ResponseEntity<Object> delete(@PathVariable Long idAuthorityType) {
        try {
            authorityTypeService.delete(idAuthorityType);
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
