A symmetric encryption scheme consists of a set of all possible messages, called the message space **M**, and three algorithms, namely,

(a) **Gen**

(b) **Enc**

(c) **Dec**

The algorithm for key generation **Gen** is used to choose a key **k** at random from the set of all possible secret keys, denoted by the key space **K**.

The algorithm for encryption **Enc** takes as inputs the message **m** and the secret key **k** and outputs the ciphertext **c**.

The algorithm for decryption **Dec** inputs the ciphertext **c** and the key **k** and outputs the message **m**.

As computing power advances, cryptographic systems that were once considered secure can become vulnerable to attacks. In cryptography, we learn that when an encryption algorithm becomes susceptible to brute force attacks due to computational advances, we need methods to strengthen it without completely redesigning the system.

**About the experiment:**

In this experiment, we work with the evolution from DES (Data Encryption Standard) to Triple DES (3DES), demonstrating how to enhance an existing encryption scheme. DES, with its 56-bit key, became vulnerable to brute force attacks as computing power increased. Triple DES addresses this vulnerability by applying the DES algorithm three times with different keys, effectively increasing the key space and security. Your task is to design and implement the Triple DES cryptosystem. Specifically, given an implementation of DES, you need to construct 3DES and understand how multiple applications of a cipher can enhance security.
