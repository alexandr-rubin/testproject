# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.9.0

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

# Use bind mounts to package.json and yarn.lock to leverage Docker's caching
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --production --frozen-lockfile

# Create the 'dist' directory if it doesn't exist
RUN mkdir -p /usr/src/app/dist

# Set permissions for the 'dist' directory
RUN chown -R node:node /usr/src/app

# Switch to the 'node' user before copying the source code
USER node

# Copy the rest of the source files into the image.
COPY . .

EXPOSE 3000

CMD yarn start
