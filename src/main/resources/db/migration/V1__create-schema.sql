    CREATE TABLE usuarios (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        usuario VARCHAR(255) NOT NULL,
        senha VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        criado_em DATETIME NOT NULL,
        ativo BOOLEAN NOT NULL
    );

    CREATE TABLE alertas (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        latitude DECIMAL(10,8) NOT NULL,
        longitude DECIMAL(11,8) NOT NULL,
        usuario_id BIGINT NOT NULL,
        criado_em DATETIME NOT NULL,
        CONSTRAINT fk_alerta_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );

    CREATE TABLE contatos (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        usuario_id BIGINT NOT NULL,
        CONSTRAINT fk_contato_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );