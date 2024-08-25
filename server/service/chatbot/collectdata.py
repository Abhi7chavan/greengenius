import nltk
from nltk.tokenize import word_tokenize
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from fastapi import FastAPI, Request
from pydantic import BaseModel
from annoy import AnnoyIndex
from sklearn.feature_extraction.text import TfidfVectorizer
import uvicorn

nltk.download('punkt')


def load_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()
    return text

data = load_data("server/service/chatbot/data.txt")
tokens = word_tokenize(data.lower())

# Create vocabulary with an unknown token
vocab = list(set(tokens))
vocab.append('<UNK>')  # Add <UNK> token
word_to_ix = {word: i for i, word in enumerate(vocab)}
ix_to_word = {i: word for i, word in enumerate(vocab)}

# Prepare sequences
def prepare_sequence(seq, word_to_ix):
    idxs = [word_to_ix.get(w, word_to_ix['<UNK>']) for w in seq]  
    return torch.tensor(idxs, dtype=torch.long)

input_seq = prepare_sequence(tokens[:-1], word_to_ix) 
target_seq = prepare_sequence(tokens[1:], word_to_ix)  
                                           
class RNNModel(nn.Module):
    def __init__(self, vocab_size, embedding_dim, hidden_dim, output_dim):
        super(RNNModel, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        self.rnn = nn.RNN(embedding_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)
    
    def forward(self, x):
        embedded = self.embedding(x)
        output, hidden = self.rnn(embedded)
        output = self.fc(output[:, -1, :])  
        return output

model = RNNModel(len(vocab), 50, 100, len(vocab))
loss_function = nn.CrossEntropyLoss()
optimizer = optim.SGD(model.parameters(), lr=0.1)

# Train the model
def train_model(model, input_seq, target_seq, loss_function, optimizer, epochs=10):
    for epoch in range(epochs):
        model.zero_grad()
        input_seq_batch = input_seq.unsqueeze(0)
        output = model(input_seq_batch)  

     
        target = target_seq[-1].unsqueeze(0)  
        
        loss = loss_function(output, target)
        loss.backward()
        optimizer.step()
        if epoch % 1 == 0:
            print(f"Epoch {epoch} Loss: {loss.item()}")

train_model(model, input_seq, target_seq, loss_function, optimizer)

documents = ["Doc 1 text", "Doc 2 text", "Doc 3 text"]
vectorizer = TfidfVectorizer()
doc_vectors = vectorizer.fit_transform(documents).toarray()


dimension = doc_vectors.shape[1]
index = AnnoyIndex(dimension, 'angular')


for i, vec in enumerate(doc_vectors):
    index.add_item(i, vec)


index.build(10)  

def search(query, top_k=5):
    query_vector = vectorizer.transform([query]).toarray()[0]
    indices, distances = index.get_nns_by_vector(query_vector, top_k, include_distances=True)
    return [(documents[i], distance) for i, distance in zip(indices, distances)]

def generate_response(query):
    retrieved_docs = search(query)
    context = " ".join([doc[0] for doc in retrieved_docs])
    context_tokens = word_tokenize(context.lower())
    input_seq = prepare_sequence(context_tokens, word_to_ix).unsqueeze(0)  
    with torch.no_grad():
        output = model(input_seq)
    predicted_ix = torch.argmax(output, dim=1).item()
    return ix_to_word[predicted_ix]

query = "What is Animal?"
response = generate_response(query)

print(response)
  
