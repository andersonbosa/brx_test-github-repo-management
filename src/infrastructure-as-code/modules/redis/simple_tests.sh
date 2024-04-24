#!/bin/bash

address=localhost
port=6379
password=admin

# Teste de criação de várias conexões
for i in {1..1000}; do
  redis-cli -h $address -p $port -a $password PING &!
  echo $?
done

# Teste de criação de várias chaves e valores
for i in {1..1000}; do
  redis-cli -h $address -p $port -a $password SET "key_$i" "value_$i" &!
  echo $?
done

# Teste de carga
for i in {1..10000}; do
  redis-cli -h $address -p $port -a $password SET "key_$i" "value_$i" > /dev/null &!
  echo $?
done
