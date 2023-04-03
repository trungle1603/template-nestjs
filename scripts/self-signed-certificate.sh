DIRECTORY=./certificates/https/

mkdir $DIRECTORY

CERT_PRIVATE_PATH=${DIRECTORY}private.pem
CERT_PUBLIC_PATH=${DIRECTORY}public.pem
CSR_PATH=${DIRECTORY}csr.pem

# Generate a private key
openssl genrsa -out ${CERT_PRIVATE_PATH} 4096

# Generate a public certificate:
openssl req -new -key ${CERT_PRIVATE_PATH} -out ${CSR_PATH}
openssl x509 -req -in ${CSR_PATH} -signkey ${CERT_PRIVATE_PATH} -out ${CERT_PUBLIC_PATH}

# Add the certificate to the trusted certificates on Linux or Windows
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    sudo cp public-certificate.pem /usr/local/share/ca-certificates/
    sudo update-ca-certificates
elif [[ "$OSTYPE" == "win32" || "$OSTYPE" == "msys" ]]; then
    certutil -addstore -user root public-certificate.pem
    echo "Okay"
else
    echo "This script is intended for Windows or Linux systems only."
    exit 1
fi

# Expiration date of the certificate
openssl x509 -noout -dates -in ${CERT_PUBLIC_PATH}