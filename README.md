# Muiltimidia

## Projeto da Unidade 1

### 1. Clonar repositório

- Abra o terminal e digite:

```
git clone https://github.com/Joao11110/Multimidia.git
```

### 2. Instalar python3 (caso não tenha ainda)

- Debian, Ubuntu, Pop_OS!, Linux Mint...:
```
sudo apt install python3
```

- Fedora, Nobara...:
```
sudo dnf install python3
```

- Arch Linux, EndeavourOS...:
```
sudo pacman -S python3
```

- Windows:
```
https://www.python.org/downloads/
```

### 3. Como rodar e circundar a política de bloqueio de arquivos do CORS

- Ainda no terminal vá até o diretório da pasta e digite:

```
cd caminho/para/a/pasta/Multimidia
```

- Agora dentro do diretório crie um servidor para conseguir carregar o arquivo de música:

```
python -m http.server 8000 
```

- Por fim, na barra de pesquisa do navegador entre em:
  
```
localhost:8000
```
