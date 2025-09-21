// controllers/produtosController.js
import pool from '../db/index.js';

// Listar todos os produtos (Admin)
export const listarProdutos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produtos ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Listar apenas produtos ativos (Público)
export const listarProdutosPublicos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produtos WHERE ativo = true ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Criar produto
export const criarProduto = async (req, res) => {
  try {
    const { nome, descricao, preco, estoque, promocao, ativo, img } = req.body;
    const result = await pool.query(
      `INSERT INTO produtos (nome, descricao, preco, estoque, promocao, ativo, img)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [nome, descricao, preco, estoque, promocao, ativo, img]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Atualizar produto
export const atualizarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const campos = [];
    const valores = [];
    let idx = 1;
    const body = req.body;

    // Só adiciona campos que vieram na requisição
    if (body.nome !== undefined) { campos.push(`nome=$${idx++}`); valores.push(body.nome); }
    if (body.descricao !== undefined) { campos.push(`descricao=$${idx++}`); valores.push(body.descricao); }
    if (body.preco !== undefined) { campos.push(`preco=$${idx++}`); valores.push(body.preco); }
    if (body.estoque !== undefined) { campos.push(`estoque=$${idx++}`); valores.push(body.estoque); }
    if (body.promocao !== undefined) { campos.push(`promocao=$${idx++}`); valores.push(body.promocao); }
    if (body.ativo !== undefined) { campos.push(`ativo=$${idx++}`); valores.push(body.ativo); }
    if (body.imagem !== undefined) { campos.push(`imagem=$${idx++}`); valores.push(body.imagem); }

    if (campos.length === 0) return res.status(400).json({ erro: 'Nenhum campo para atualizar' });

    valores.push(id);
    const query = `UPDATE produtos SET ${campos.join(', ')} WHERE id=$${idx} RETURNING *`;

    const result = await pool.query(query, valores);
    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Atualizar imagem do produto
export const atualizarImagemProduto = async (id, caminhoImagem) => {
  try {
    await pool.query(
      `UPDATE produtos SET imagem=$1 WHERE id=$2`,
      [caminhoImagem, id]
    );
  } catch (err) {
    throw new Error(err.message);
  }
};
