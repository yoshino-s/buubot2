FROM openjdk:8-jre-alpine

WORKDIR /app/

COPY entrypoint.sh /
COPY ./src/ /app/

EXPOSE 8080

CMD [ "/entrypoint.sh" ]