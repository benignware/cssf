# Use an ARM64 base image
FROM arm64v8/ubuntu:20.04

# Install dependencies
RUN apt-get update && \
    apt-get install -y wget unzip \
    libnss3 libgconf-2-4 \
    chromium-browser chromium-chromedriver

# Install the latest Selenium server
RUN wget https://selenium-release.storage.googleapis.com/4.20/selenium-server-4.20.0.jar

# Expose port for Selenium
EXPOSE 4444

# Set the DISPLAY environment variable
ENV DISPLAY=:99

# Run Selenium server
ENTRYPOINT ["java", "-jar", "/selenium-server-4.20.0.jar"]
