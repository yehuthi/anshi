cmake_minimum_required(VERSION 3.15...3.30)
project(anshi LANGUAGES C)

set(HEADER_NAME ${PROJECT_NAME})

add_custom_command(
	OUTPUT "${CMAKE_SOURCE_DIR}/include/${HEADER_NAME}.h"
	COMMAND mkdir ${CMAKE_SOURCE_DIR}/include
	COMMAND node "${CMAKE_SOURCE_DIR}/codegen.js" > ${CMAKE_SOURCE_DIR}/include/${HEADER_NAME}.h
	MAIN_DEPENDENCY "${CMAKE_SOURCE_DIR}/codegen.js"
)

add_library(ansicolor INTERFACE include/${HEADER_NAME}.h)
target_include_directories(ansicolor INTERFACE include)

option(BUILD_DEMO "Build demo" OFF)
if (BUILD_DEMO)
	add_executable(demo demo.c)
	target_link_libraries(demo ansicolor)
endif()
i

