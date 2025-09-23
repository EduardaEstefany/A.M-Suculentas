--
-- PostgreSQL database dump
--

\restrict AcveFure1RNrgfofm1vxKwSCCSqnbYdFyGSl2oV7gZtQ42qbq3X7dDk4pWQnJ2G

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-09-23 19:51:50

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16460)
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    telefone character varying(20)
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16459)
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clientes_id_seq OWNER TO postgres;

--
-- TOC entry 4924 (class 0 OID 0)
-- Dependencies: 217
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;


--
-- TOC entry 222 (class 1259 OID 16525)
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    titulo character varying(100),
    descricao text,
    data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ativo boolean DEFAULT true,
    cliente_id integer
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16524)
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_id_seq OWNER TO postgres;

--
-- TOC entry 4925 (class 0 OID 0)
-- Dependencies: 221
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- TOC entry 220 (class 1259 OID 16478)
-- Name: produtos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produtos (
    id integer NOT NULL,
    nome character varying(100) NOT NULL,
    descricao text,
    preco numeric(10,2) NOT NULL,
    estoque integer DEFAULT 0,
    promocao numeric(10,0),
    ativo boolean DEFAULT true,
    imagem text
);


ALTER TABLE public.produtos OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16477)
-- Name: produtos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produtos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produtos_id_seq OWNER TO postgres;

--
-- TOC entry 4926 (class 0 OID 0)
-- Dependencies: 219
-- Name: produtos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produtos_id_seq OWNED BY public.produtos.id;


--
-- TOC entry 4752 (class 2604 OID 16463)
-- Name: clientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);


--
-- TOC entry 4756 (class 2604 OID 16528)
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- TOC entry 4753 (class 2604 OID 16481)
-- Name: produtos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos ALTER COLUMN id SET DEFAULT nextval('public.produtos_id_seq'::regclass);


--
-- TOC entry 4914 (class 0 OID 16460)
-- Dependencies: 218
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clientes (id, nome, email, telefone) FROM stdin;
\.


--
-- TOC entry 4918 (class 0 OID 16525)
-- Dependencies: 222
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, titulo, descricao, data_criacao, ativo, cliente_id) FROM stdin;
\.


--
-- TOC entry 4916 (class 0 OID 16478)
-- Dependencies: 220
-- Data for Name: produtos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produtos (id, nome, descricao, preco, estoque, promocao, ativo, imagem) FROM stdin;
1	Suculenta 1	\N	25.00	5	0	t	/assets/produtosImg/produto-1.jpg
2	Suculenta 2	\N	20.00	10	20	t	/assets/produtosImg/produto-2.jpg
3	Suculenta 3	\N	15.00	15	15	t	/assets/produtosImg/produto-3.jpg
4	Suculenta 4	\N	10.00	20	10	t	/assets/produtosImg/produto-4.png
5	Suculenta 5	\N	5.00	25	5	t	/assets/produtosImg/produto-5.png
\.


--
-- TOC entry 4927 (class 0 OID 0)
-- Dependencies: 217
-- Name: clientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clientes_id_seq', 1, false);


--
-- TOC entry 4928 (class 0 OID 0)
-- Dependencies: 221
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posts_id_seq', 1, false);


--
-- TOC entry 4929 (class 0 OID 0)
-- Dependencies: 219
-- Name: produtos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produtos_id_seq', 5, true);


--
-- TOC entry 4760 (class 2606 OID 16469)
-- Name: clientes clientes_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_email_key UNIQUE (email);


--
-- TOC entry 4762 (class 2606 OID 16467)
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- TOC entry 4766 (class 2606 OID 16534)
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- TOC entry 4764 (class 2606 OID 16486)
-- Name: produtos produtos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_pkey PRIMARY KEY (id);


--
-- TOC entry 4767 (class 2606 OID 24757)
-- Name: posts fk_cliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT fk_cliente FOREIGN KEY (cliente_id) REFERENCES public.clientes(id);


-- Completed on 2025-09-23 19:51:50

--
-- PostgreSQL database dump complete
--

\unrestrict AcveFure1RNrgfofm1vxKwSCCSqnbYdFyGSl2oV7gZtQ42qbq3X7dDk4pWQnJ2G

