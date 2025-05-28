# Sistema de Cadastro de Veículos

Aplicação Java com Spring Boot para cadastrar, listar, editar e excluir veículos (carros e motos). Integração via JDBC com PostgreSQL e frontend usando Axios.

## Tecnologias Utilizadas

### Backend
- Java 17  
- Spring Boot / Spring MVC  
- JDBC  
- PostgreSQL  
- Maven

### Frontend
- HTML5, CSS3, JavaScript  
- Axios

## Pré-requisitos
 
- Java JDK 17 
- Apache Maven  
- PostgreSQL (com banco `empresaXWZ_Prod`)  
- IDE Java (IntelliJ, Eclipse ou VS Code com extensão Java)

##Estrutura do Projeto

```
src/main/java/org/example/
├── config/           # Configurações (ex: CORS)
├── dao/impl/         # DAOs com JDBC
├── domain/           # Entidades (Veiculo, Carro, Moto)
├── service/          # Regras de negócio
├── web/controller/   # Endpoints REST
├── web/dto/          # DTOs de entrada
```

## Como Rodar

1. **Configure o banco no PostgreSQL:**
   - Conexão: `jdbc:postgresql://localhost:5432/postgres`
   - Usuário: `postgres`
   - Senha: `12345`
   - Execute os scripts abaixo no PgAdmin4 ou cliente SQL.

2. **Scripts de Criação de Tabelas:**

```sql
CREATE TABLE IF NOT EXISTS public.veiculo (
    id SERIAL PRIMARY KEY,
    modelo VARCHAR(100) NOT NULL,
    fabricante VARCHAR(100) NOT NULL,
    ano INTEGER NOT NULL,
    preco NUMERIC(10,2) NOT NULL,
    tipo_veiculo VARCHAR(10) NOT NULL,
    cor VARCHAR(50),
    CONSTRAINT veiculo_tipo_check CHECK (tipo_veiculo IN ('CARRO', 'MOTO'))
);
CREATE TABLE IF NOT EXISTS public.carro (
    id_veiculo INTEGER PRIMARY KEY,
    quantidade_portas INTEGER NOT NULL,
    tipo_combustivel VARCHAR(20) NOT NULL,
    CONSTRAINT fk_carro_veiculo FOREIGN KEY (id_veiculo)
        REFERENCES public.veiculo(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS public.moto (
    id_veiculo INTEGER PRIMARY KEY,
    cilindradas INTEGER NOT NULL,
    CONSTRAINT fk_moto_veiculo FOREIGN KEY (id_veiculo)
        REFERENCES public.veiculo(id) ON DELETE CASCADE
);
ALTER TABLE IF EXISTS public.moto OWNER TO postgres;
```

- A base URL para chamadas Axios deve ser:
```
http://localhost:8080
```

## Endpoints da API

### Carro
- `POST /carro/cadastro`  
- `PUT /carro/atualizarVeiculo/{id}`

### Moto
- `POST /moto/cadastro`  
- `PUT /moto/atualizarMoto/{id}`

### Veículo (genérico)
- `GET /veiculo/consultar/todos`  
- `GET /veiculo/consultar`  
- `GET /veiculo/consultar/{id}`  
- `DELETE /veiculo/excluir/{id}`

## Conexão com o Banco

As conexões são feitas diretamente nas DAOs via JDBC:

```java
private Connection getConnection() throws SQLException {
    String urlConexao = "jdbc:postgresql://localhost:5432/postgres";
    String usuarioDB = "postgres";
    String senhaDB = "12345";
    return DriverManager.getConnection(urlConexao, usuarioDB, senhaDB);
}
```

