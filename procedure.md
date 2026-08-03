This experiment demonstrates how DES and Triple DES (3DES) operate on fixed-size 64-bit blocks. Follow the steps below in sequence.

### Step 1: Review Part I Configuration

In **Part I: Key Configuration**, first observe the values shown in **DES Configuration Overview**:

- Current Message (must be 64 bits, shown as 8 groups of 8 bits)
- Key Part A (16 hexadecimal digits)
- Key Part B (16 hexadecimal digits)

Use the controls as needed:

- **Change plaintext**:
  - You can enter a custom 64-bit binary message (spaces are allowed between groups), or
  - Leave the prompt empty to generate a random 64-bit message.
  - Invalid message length/format is rejected with an inline error.
- **Change Key A** generates a random 16-hex-digit key for Part A.
- **Change Key B** generates a random 16-hex-digit key for Part B.

### Step 2: Select Input Type in Part II

In **Part II: Encryption/Decryption Operations**, choose input format:

- **ASCII (8 characters)** for text like `ABCDEFGH`
- **Hex (16 digits)** for values like `0123456789ABCDEF`

The placeholder and info hint update automatically based on the selected format.

### Step 3: Enter Plaintext and Key

In Part II, provide:

- **Plaintext** in the selected format
- **Key** as exactly 16 hexadecimal digits

Validation behavior:

- Invalid plaintext/key shows inline error text next to the field and a red highlight.
- Valid input clears the error automatically.

### Step 4: Run DES Encrypt/Decrypt

Use the DES buttons in Part II:

- **DES Encrypt** encrypts the plaintext with the provided key.
- **DES Decrypt** applies DES decryption with the provided key.
- The 64-bit result appears in **Output**.

If input is invalid, output is not generated until errors are fixed.

### Step 5: Generate Triple DES Output

Click **Show TDES Output** in Part II to compute Triple DES using the current values:

- Input message from Part II plaintext field
- Key Part A from Part I
- Key Part B from Part I

Pipeline used:

- Encrypt with Key A
- Decrypt with Key B
- Encrypt with Key A

The final 64-bit value appears in **TDES Output**.

### Step 6: Verify in Part III

In **Part III: Answer Verification**:

- Copy your computed 3DES value into **Your Answer**.
- Click **Check Answer!** to verify.

You will see a success or retry notification based on the match.

### Step 7: Use Reveal Answer (Optional)

If needed, click **Reveal Answer** to view:

- The correct 3DES result for the current configuration
- A step-by-step explanation of the 3DES EDE process

### Quick Practice Set

Use this known DES test vector in Part II:

- Input Type: **Hex (16 digits)**
- Plaintext: `0123456789ABCDEF`
- Key: `133457799BBCDFF1`
- Click **DES Encrypt**

Expected DES output corresponds to:

- `85E813540F0AB405` (shown in the simulation as grouped binary)
