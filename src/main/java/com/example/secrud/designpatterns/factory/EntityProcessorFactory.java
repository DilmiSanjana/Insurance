package com.example.secrud.designpatterns.factory;

public interface EntityProcessorFactory<T> {
    EntityProcessor<T> createProcessor(String type);
}
