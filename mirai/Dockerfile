FROM openjdk:8-jre-alpine

WORKDIR /app/

COPY ./src/ /app/
COPY entrypoint.sh entrypoint-interactive.sh /

RUN chmod +x /entrypoint.sh /entrypoint-interactive.sh

EXPOSE 8080

CMD [ "/entrypoint.sh" ]