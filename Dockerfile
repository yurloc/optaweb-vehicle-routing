# Copyright 2020 Red Hat, Inc. and/or its affiliates.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# This is a multi-staged Dockerfile that uses Maven builder image to build the whole project with Maven.
# In the second phase, the standalone Spring Boot executable JAR is placed into an OpenJDK JRE image.
#
# Build an image:
# docker build -t optaweb/vehicle-routing .
#
# Run the image with default profile (using in-memory H2 database):
# docker run -p 8080:8080 --rm -it optaweb/vehicle-routing
#
# Run the image with production profile (using PostgreSQL database):
# docker run -p 8080:8080 --rm -it -e SPRING_PROFILES_ACTIVE=production optaweb/vehicle-routing

FROM adoptopenjdk/maven-openjdk8:latest as builder
WORKDIR /usr/src/optaweb
COPY . .
RUN mvn clean package -DskipTests --projects :optaweb-vehicle-routing-standalone --also-make

FROM adoptopenjdk/openjdk8:ubi-minimal-jre
WORKDIR /opt/app
VOLUME local

COPY --from=builder /usr/src/optaweb/optaweb-vehicle-routing-standalone/target/*-exec.jar optaweb-vehicle-routing.jar

ADD http://download.geofabrik.de/europe/france/mayotte-latest.osm.pbf openstreetmap/

ENV APP_ROUTING_OSM_DIR=openstreetmap
ENV APP_ROUTING_OSM_FILE=mayotte-latest.osm.pbf
ENV APP_REGION_COUNTRY_CODES=FR
CMD ["java", "-jar", "optaweb-vehicle-routing.jar"]
EXPOSE 8080
