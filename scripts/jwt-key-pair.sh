DIRECTORY=./certificates/jwt/

mkdir $DIRECTORY

JWT_PRIVATE_PATH=${DIRECTORY}/private.pem
JWT_PUBLIC_PATH=${DIRECTORY}/public.pem

# Generate private key
openssl genrsa -out ${JWT_PRIVATE_PATH} 4096 

# Generate public key
openssl rsa -in ${JWT_PRIVATE_PATH} -outform PEM -pubout -out ${JWT_PUBLIC_PATH}