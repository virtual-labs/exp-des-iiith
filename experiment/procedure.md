**Step 1:** In **Part I: Key Configuration**, observe the current message and keys displayed in the **DES Configuration Overview** section. You can modify these by clicking the respective buttons:

- Click **"Change plaintext"** to generate a new random 64-bit message
- Click **"Change Key A"** to generate a new random hexadecimal key for Part A
- Click **"Change Key B"** to generate a new random hexadecimal key for Part B

**Step 2:** In **Part II: Encryption/Decryption Operations**, select your preferred input type:

- Choose **"ASCII (8 characters)"** for text input like "ABCDEFGH"
- Choose **"Hex (16 digits)"** for hexadecimal input like "0123456789ABCDEF"

**Step 3:** Enter your plaintext in the **Plaintext** field and a 16-digit hexadecimal key in the **Key** field. Use the info icons (ℹ️) for format guidance and examples.

**Step 4:** Perform DES operations:

- Click **"DES Encrypt"** to encrypt your plaintext using standard DES
- Click **"DES Decrypt"** to decrypt ciphertext back to plaintext
- The result will appear in the **Output** field

**Step 5:** Generate Triple DES (3DES) result:

- Click **"Show TDES Output"** to automatically perform the complete 3DES encryption process
- This uses the message and keys from Part I to perform: Encrypt(KeyA) → Decrypt(KeyB) → Encrypt(KeyA)
- The 3DES result will appear in the **TDES Output** field

**Step 6:** In **Part III: Answer Verification**, enter your calculated 3DES result in the **"Your Answer"** field and click **"Check Answer!"** to verify if it matches the expected output.

**Step 7:** If you need help, click **"Reveal Answer"** to see the correct 3DES result along with a detailed explanation of the Triple DES encryption process and why it provides enhanced security over standard DES.
