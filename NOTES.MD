

# Réunion

```mermaid
app ->> api : http request : criar ordem de pedido para usuário
api ->> fila : amqp : adicionar ordem a fila
api ->> app : http response : ordem criada, o ID é tal
app -> app : function : armazenar ordem criada para uso futuro

workers ->> fila : amqp : ler dado da fila
workers ->> worker especifico : function : processamento em segundo plano
```