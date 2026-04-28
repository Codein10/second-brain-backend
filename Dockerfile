FROM node:18

WORKDIR /app

# Step 1: package files copy
COPY package*.json ./

# Step 2: install dependencies
RUN npm install

# Step 3: code copy
COPY . .

# Step 4: build the app (IMPORTANT ORDER)
RUN npm run build

# Step 5: expose port
EXPOSE 3000

# Step 6: start app
CMD ["node", "dist/index.js"]