// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import produtosRoutes from './routes/produtosRoutes.js';
import multer from 'multer';

const app = express();
const PORT = 3000;

// __dirname no ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware JSON
app.use(express.json());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/produtos', produtosRoutes);

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/assets/produtosImg'));
  },
  filename: (req, file, cb) => {
    cb(null, `produto_${req.params.id}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Endpoint para upload de imagem
app.post('/produtos/:id/imagem', upload.single('imagem'), async (req, res) => {
  try {
    const pool = (await import('./db/index.js')).default;
    const id = req.params.id;
    const filename = req.file.filename;

    // Atualiza apenas o nome do arquivo no banco
    await pool.query('UPDATE produtos SET imagem=$1 WHERE id=$2', [filename, id]);

    res.json({ message: 'Imagem atualizada!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao enviar imagem' });
  }
});

// Servir painel admin
app.use('/admin', express.static(path.join(__dirname, 'private')));

// Rota inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
