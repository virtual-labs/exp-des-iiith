For a very brief theory of Data Encryption Standard and their analysis, click [here](docs/DES1.pdf)

The Data Encryption Standard (DES) is a symmetric-key block cipher published by the U.S. National Bureau of Standards as **FIPS PUB 46** in 1977. Following the generic symmetric-key scheme (Gen, Enc, Dec) described in the Aim, DES instantiates **Gen** as the generation of a 64-bit key, **Enc** as the DES encryption algorithm, and **Dec** as its inverse. DES encrypts data in 64-bit blocks using a 56-bit effective key (stored as a 64-bit key with 8 parity bits). As computing power increased, exhaustive key search against this 56-bit key space became practical, which led to the development of Triple DES (3DES) and, eventually, to the replacement of both by the Advanced Encryption Standard (AES).

### How DES Works

1. **Block Size**: DES operates on 64-bit blocks of plaintext, producing 64-bit blocks of ciphertext.
2. **Key Size**: Uses a 64-bit key of which only 56 bits are effective; the remaining 8 bits are parity bits (1 per byte) used for error detection, not security.
3. **Rounds**: Performs 16 rounds of identical Feistel operations on the data, each round using a distinct 48-bit round key.
4. **Structure (Feistel Network)**: Each 64-bit block is split into two 32-bit halves, $L_0$ and $R_0$. For round $i = 1, \dots, 16$:

$$L_i = R_{i-1}$$

$$R_i = L_{i-1} \oplus f(R_{i-1}, K_i)$$

where $f$ is the round (Feistel) function, $K_i$ is the $i$-th round key, and $\oplus$ denotes bitwise XOR. Because of this structure, DES decryption uses the _exact same algorithm_ as encryption, only with the round keys $K_1, \dots, K_{16}$ applied in reverse order — a key practical advantage of Feistel ciphers over Substitution-Permutation Networks (SPNs).

5. **Round (Feistel) Function $f$**:
   - **Expansion (E)**: The 32-bit half-block $R_{i-1}$ is expanded to 48 bits by duplicating and permuting bits.
   - **Key Mixing**: The 48-bit expanded value is XORed with the 48-bit round key $K_i$.
   - **Substitution (S-boxes)**: The 48-bit result is split into eight 6-bit chunks; each chunk passes through one of eight fixed, non-linear substitution boxes ($S_1, \dots, S_8$), each mapping 6 input bits to 4 output bits, giving a 32-bit result. The S-boxes are the sole source of non-linearity in DES and are critical to its resistance against simple algebraic attacks.
   - **Permutation (P)**: A fixed permutation is applied to the 32-bit S-box output before it is XORed into the next round.

6. **Key Schedule**: The 64-bit key is first reduced to 56 bits by Permuted Choice 1 (PC-1), which discards the 8 parity bits and permutes the rest. The 56 bits are split into two 28-bit halves, $C_0$ and $D_0$. In each of the 16 rounds, both halves are left-circularly shifted by 1 or 2 bits (1 bit in rounds 1, 2, 9, 16; 2 bits in all other rounds), and Permuted Choice 2 (PC-2) selects and permutes 48 of the resulting 56 bits to form that round's key $K_i$.

### Triple DES (3DES) Enhancement

Triple DES was introduced (standardized in FIPS 46-3 and ANSI X9.52) to reuse the well-analyzed DES algorithm while defeating brute-force attacks, by chaining DES together in an **Encrypt–Decrypt–Encrypt (EDE)** sequence rather than three plain encryptions:

1. **First Stage**: Encrypt the plaintext with Key 1 ($K_1$).
2. **Second Stage**: Decrypt the result with Key 2 ($K_2$).
3. **Third Stage**: Encrypt the result with Key 3 ($K_3$).
4. **Keying Options**: Three standard variants exist, depending on how the keys relate:
   - **Option 1** (three independent keys, $K_1 \neq K_2 \neq K_3$): 168-bit key material, the strongest variant.
   - **Option 2** (two keys, $K_3 = K_1$): 112-bit key material; the most widely deployed variant historically.
   - **Option 3** ($K_1 = K_2 = K_3$): mathematically collapses to single DES, since encrypting and then decrypting with the same key cancels out — this gives 3DES hardware/software full backward compatibility with legacy DES systems.

   The decrypt-in-the-middle step is what makes Option 3 backward-compatible; a plain Encrypt–Encrypt–Encrypt scheme would not have this property.

### Mathematical Representation

**Single DES:**

$$C = E_K(P) \qquad P = D_K(C)$$

**Triple DES (general form, three keys):**

$$C = E_{K_3}\big(D_{K_2}\big(E_{K_1}(P)\big)\big)$$

$$P = D_{K_1}\big(E_{K_2}\big(D_{K_3}(C)\big)\big)$$

Where:

- $P$ is the plaintext block (64 bits)
- $C$ is the ciphertext block (64 bits)
- $E_K(\cdot)$ and $D_K(\cdot)$ denote DES encryption and decryption under key $K$
- $K_1, K_2, K_3$ are the (56-bit effective) keys used in 3DES; setting $K_3 = K_1$ gives 2-key 3DES, and setting $K_1 = K_2 = K_3$ reduces the scheme to single DES

### Security Analysis

#### DES Vulnerabilities:

1. **Key Size**: The 56-bit effective key gives only $2^{56}$ possible keys, small enough for exhaustive (brute-force) search with dedicated hardware.
2. **Demonstrated Breaks**: In 1998, the EFF's purpose-built "Deep Crack" machine recovered a DES key in about 56 hours; in 1999, a combined effort with distributed.net reduced this to about 22 hours. These public demonstrations were a major factor in DES being deprecated for new use.
3. **Cryptanalysis**: DES is also studied against differential and linear cryptanalysis; while these academic attacks require large amounts of chosen/known plaintext and are less practical than brute force, they show DES's security margin is thinner than its key size alone suggests.
4. **Formal Withdrawal**: NIST formally withdrew DES as a FIPS-approved algorithm in 2005 (withdrawal of FIPS 46-3), after which it was retained only for legacy/compatibility use via 3DES.

#### Triple DES Advantages:

1. **Effective Key Length**: 2-key 3DES offers only about $2^{112}$ effective security, not $2^{112+56}$, because of a meet-in-the-middle attack (see below) — this is still far stronger than DES's $2^{56}$.
2. **Backward Compatibility**: Setting all three keys equal ($K_1 = K_2 = K_3$) makes 3DES hardware/software behave as plain DES, easing migration from legacy systems.
3. **Proven Security**: As a direct extension of a heavily analyzed cipher, 3DES inherited decades of DES cryptanalysis without needing a new, less-studied design.
4. **Modern Status**: Despite its strength, NIST's SP 800-67 disallowed 3DES for new applications and set 2023 as the end date for its use in protocols such as TLS, in favor of AES, which offers both stronger security and much better performance.

<img src="images/image7.png">

### Breaking and Security Considerations

#### DES can be broken using:

1. **Brute Force Attack**: All $2^{56}$ possible keys can be tested; this is the primary practical threat and the one demonstrated by the EFF Deep Crack.
2. **Differential Cryptanalysis**: Exploits how differences in plaintext pairs propagate through the round function to recover key bits.
3. **Linear Cryptanalysis**: Constructs linear approximations of the S-boxes to statistically recover key bits from large amounts of known plaintext.

#### Triple DES Security:

- **Why Not Double DES?** A naive Double DES ($C = E_{K_2}(E_{K_1}(P))$) does _not_ give $2^{112}$ security. A meet-in-the-middle attack — computing and storing $E_{K_1}(P)$ for all $K_1$, and separately $D_{K_2}(C)$ for all $K_2$, then matching — reduces its effective strength to roughly $2^{57}$, barely better than single DES. This is precisely why three stages (not two) are used.
- **Meet-in-the-Middle on 3DES**: The same style of attack against 3DES reduces its effective security to about $2^{112}$ operations (for 2-key 3DES), which remains computationally infeasible today.
- **Sweet32 (2016)**: Because DES/3DES still uses a 64-bit block size, birthday-bound collision attacks (e.g., the Sweet32 attack, CVE-2016-2183) become practical against very long-lived encrypted connections (such as long TLS or VPN sessions), independent of key length. This 64-bit block size limitation — not brute force — is the main reason modern protocols moved away from 3DES entirely.
- **Performance Trade-off**: 3DES is roughly three times slower than single DES, since it performs three full DES operations per block; combined with its Sweet32 exposure, this is why AES (128-bit block, comparable or better speed) is now preferred for all new designs.
