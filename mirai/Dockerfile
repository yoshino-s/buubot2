FROM openjdk:8-jre-alpine

WORKDIR /app/

COPY ./src/ /app/
COPY entrypoint.sh /

RUN chmod +x /entrypoint.sh

EXPOSE 8080

CMD [ "/entrypoint.sh" ]