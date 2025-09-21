import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  listarProdutos, 
  listarProdutosPublicos, 
  criarProduto, 
  atualizarProduto, 
  atualizarImagemProduto 
} from '../controllers/produtosController.js';

const router = express.Router();

// Config multer para upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join('public/assets/produtosImg'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `produto-${req.params.id}${ext}`); // sobrescreve arquivo antigo
  }
});
const upload = multer({ storage });

// Rotas CRUD
router.get('/', listarProdutos); // admin
router.get('/publicos', listarProdutosPublicos); // site público
router.post('/', criarProduto);
router.put('/:id', atualizarProduto);

// Upload de imagem
router.post('/:id/imagem', upload.single('imagem'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ erro: 'Nenhum arquivo enviado' });

    const caminhoImagem = `/assets/produtosImg/${req.file.filename}`;
    await atualizarImagemProduto(req.params.id, caminhoImagem);

    res.json({ mensagem: 'Imagem atualizada com sucesso', img: caminhoImagem });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

export default router;
