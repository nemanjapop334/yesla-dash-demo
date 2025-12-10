# ---- Build stage ----
FROM node:18-alpine AS build

WORKDIR /app

# Kopiramo package fajlove
COPY package.json package-lock.json ./

# Instaliramo dependencije
RUN npm install

# Kopiramo ostatak projekta
COPY . .

# Buildujemo aplikaciju (uz korišćenje ARG varijabli ako postoje)
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

RUN npm run build


# ---- Production stage (Nginx) ----
FROM nginx:alpine

# Obriši default nginx konfiguraciju
RUN rm /etc/nginx/conf.d/default.conf

# Ubacujemo naš nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiramo build u nginx html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (nginx)
EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]
