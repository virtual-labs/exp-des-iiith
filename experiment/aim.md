A symmetric-key encryption scheme consists of a message space **M**, a key space **K**, and three fundamental algorithms:

(a) **Gen** – Generates a secret key from the key space **K**.

(b) **Enc** – Encrypts a plaintext message **m** using the secret key **k** to produce ciphertext **c**.

(c) **Dec** – Decrypts the ciphertext **c** using the same secret key **k** to recover the original plaintext **m**.

In symmetric cryptography, both the sender and the receiver use the same secret key for encryption and decryption. Such algorithms are widely used because they provide fast and efficient encryption for large amounts of data.

The **Data Encryption Standard (DES)** is one of the earliest standardized symmetric-key block ciphers. It encrypts 64-bit blocks of data using an effective 56-bit secret key through 16 rounds of Feistel network operations. Although DES was once considered secure, advances in computing power have made exhaustive key-search (brute-force) attacks practical.

To improve security while preserving compatibility with DES, **Triple DES (3DES)** was introduced. Instead of designing a completely new algorithm, Triple DES applies the DES algorithm three times using two or three keys, significantly increasing the effective security against brute-force attacks.

**About the Experiment**

In this experiment, you will study the working principles of DES and understand its limitations. You will perform DES encryption and decryption, and then implement the Triple DES (3DES) Encrypt–Decrypt–Encrypt (EDE) process using an existing DES implementation. The experiment demonstrates how repeated application of a secure block cipher can considerably strengthen security while maintaining compatibility with legacy DES systems.
