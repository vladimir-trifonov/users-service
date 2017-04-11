FROM node:7.8.0

# Create a new user to our new container and avoid the root user
RUN useradd --user-group --create-home --shell /bin/false usersService && \
    apt-get clean

ENV HOME=/home/app

COPY package.json $HOME/app/
COPY src/ $HOME/app/src

RUN chown -R usersService:usersService $HOME/* /usr/local/

WORKDIR $HOME/app

RUN npm cache clean && \
    npm install --silent --progress=false --production

RUN chown -R usersService:usersService $HOME/*

USER usersService

EXPOSE 3000

CMD ["npm", "start"]