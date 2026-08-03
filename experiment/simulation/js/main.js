// add a bit string to the output, inserting spaces as designated
function format_bitstring(ary, spacing) {
  var i;

  var formatted_bitstring = "";

  // add bits
  for (i = 1; i < ary.length; i++) {
    if (i % spacing == 1) formatted_bitstring += " "; // time to add a space
    formatted_bitstring += ary[i]; // and the bit
  }
  return formatted_bitstring;
}

// special value stored in x[0] to indicate a problem
var ERROR_VAL = -9876;

function format_binary_groups(bitString) {
  return bitString.match(/.{1,8}/g).join(" ");
}

function randomBinaryString(length) {
  var str = "";
  for (var i = 0; i < length; i++) {
    str += Math.floor(Math.random() * 2);
  }
  return str;
}

function set_inline_error(inputId, errorId, message) {
  var input = document.getElementById(inputId);
  var error = document.getElementById(errorId);
  if (input) {
    input.style.borderColor = "#dc3545";
    input.style.boxShadow = "0 0 0 2px rgba(220, 53, 69, 0.15)";
  }
  if (error) {
    error.textContent = message;
    error.style.display = "block";
  }
}

function clear_inline_error(inputId, errorId) {
  var input = document.getElementById(inputId);
  var error = document.getElementById(errorId);
  if (input) {
    input.style.borderColor = "#ccc";
    input.style.boxShadow = "none";
  }
  if (error) {
    error.textContent = "";
    error.style.display = "none";
  }
}

function validatePartIMessageBinary(messageValue) {
  var cleaned = remove_spaces(messageValue || "");
  if (cleaned.length !== 64) {
    return {
      valid: false,
      message: "Message must contain exactly 64 binary digits (8 groups of 8).",
    };
  }
  if (!/^[01]{64}$/.test(cleaned)) {
    return {
      valid: false,
      message: "Message can only contain binary digits 0 and 1.",
    };
  }
  return { valid: true, cleaned: cleaned };
}

function applyPartIMessage(cleanedBinary64) {
  var formatted = format_binary_groups(cleanedBinary64);
  document.getElementById("plaintext").value = formatted;
  document.getElementById("currentMessage").textContent = formatted;
}

function validatePartIIPlaintext() {
  var inputType = document.getElementById("inputType").value;
  var plaintext = document.getElementById("plaintext2").value;

  if (inputType === "ascii") {
    if (plaintext.length !== 8) {
      set_inline_error(
        "plaintext2",
        "plaintextValidationError",
        "Plaintext must be exactly 8 ASCII characters in ASCII mode.",
      );
      return false;
    }
    for (var i = 0; i < plaintext.length; i++) {
      if (plaintext.charCodeAt(i) > 127) {
        set_inline_error(
          "plaintext2",
          "plaintextValidationError",
          "Only ASCII characters (code 0-127) are allowed in ASCII mode.",
        );
        return false;
      }
    }
  } else if (inputType === "hex") {
    var hexPlaintext = remove_spaces(plaintext);
    if (!/^[0-9a-fA-F]{16}$/.test(hexPlaintext)) {
      set_inline_error(
        "plaintext2",
        "plaintextValidationError",
        "Plaintext must be exactly 16 hexadecimal digits in Hex mode.",
      );
      return false;
    }
  } else if (inputType === "binary") {
    var binaryPlaintext = remove_spaces(plaintext);
    if (!/^[01]{64}$/.test(binaryPlaintext)) {
      set_inline_error(
        "plaintext2",
        "plaintextValidationError",
        "Plaintext must be exactly 64 binary digits in Binary mode.",
      );
      return false;
    }
  }

  clear_inline_error("plaintext2", "plaintextValidationError");
  return true;
}

function validateHexKeyField(inputId, errorId, label) {
  var keyValue = remove_spaces(document.getElementById(inputId).value || "");
  if (!/^[0-9a-fA-F]{16}$/.test(keyValue)) {
    set_inline_error(
      inputId,
      errorId,
      label + " must be exactly 16 hexadecimal digits.",
    );
    return false;
  }
  clear_inline_error(inputId, errorId);
  return true;
}

function initializePartIMessage() {
  var currentValue = document.getElementById("plaintext").value;
  var messageValidation = validatePartIMessageBinary(currentValue);
  if (!messageValidation.valid) {
    var generated = randomBinaryString(64);
    applyPartIMessage(generated);
  } else {
    applyPartIMessage(messageValidation.cleaned);
  }
  clear_inline_error("plaintext", "messageValidationError");
}

// initial permutation (split into left/right halves )
// since DES numbers bits starting at 1, we will ignore x[0]
var IP_perm = new Array(
  -1,
  58,
  50,
  42,
  34,
  26,
  18,
  10,
  2,
  60,
  52,
  44,
  36,
  28,
  20,
  12,
  4,
  62,
  54,
  46,
  38,
  30,
  22,
  14,
  6,
  64,
  56,
  48,
  40,
  32,
  24,
  16,
  8,
  57,
  49,
  41,
  33,
  25,
  17,
  9,
  1,
  59,
  51,
  43,
  35,
  27,
  19,
  11,
  3,
  61,
  53,
  45,
  37,
  29,
  21,
  13,
  5,
  63,
  55,
  47,
  39,
  31,
  23,
  15,
  7,
);

// final permutation (inverse initial permutation)
var FP_perm = new Array(
  -1,
  40,
  8,
  48,
  16,
  56,
  24,
  64,
  32,
  39,
  7,
  47,
  15,
  55,
  23,
  63,
  31,
  38,
  6,
  46,
  14,
  54,
  22,
  62,
  30,
  37,
  5,
  45,
  13,
  53,
  21,
  61,
  29,
  36,
  4,
  44,
  12,
  52,
  20,
  60,
  28,
  35,
  3,
  43,
  11,
  51,
  19,
  59,
  27,
  34,
  2,
  42,
  10,
  50,
  18,
  58,
  26,
  33,
  1,
  41,
  9,
  49,
  17,
  57,
  25,
);

// per-round expansion
var E_perm = new Array(
  -1,
  32,
  1,
  2,
  3,
  4,
  5,
  4,
  5,
  6,
  7,
  8,
  9,
  8,
  9,
  10,
  11,
  12,
  13,
  12,
  13,
  14,
  15,
  16,
  17,
  16,
  17,
  18,
  19,
  20,
  21,
  20,
  21,
  22,
  23,
  24,
  25,
  24,
  25,
  26,
  27,
  28,
  29,
  28,
  29,
  30,
  31,
  32,
  1,
);

// per-round permutation
var P_perm = new Array(
  -1,
  16,
  7,
  20,
  21,
  29,
  12,
  28,
  17,
  1,
  15,
  23,
  26,
  5,
  18,
  31,
  10,
  2,
  8,
  24,
  14,
  32,
  27,
  3,
  9,
  19,
  13,
  30,
  6,
  22,
  11,
  4,
  25,
);

// note we do use element 0 in the S-Boxes
var S1 = new Array(
  14,
  4,
  13,
  1,
  2,
  15,
  11,
  8,
  3,
  10,
  6,
  12,
  5,
  9,
  0,
  7,
  0,
  15,
  7,
  4,
  14,
  2,
  13,
  1,
  10,
  6,
  12,
  11,
  9,
  5,
  3,
  8,
  4,
  1,
  14,
  8,
  13,
  6,
  2,
  11,
  15,
  12,
  9,
  7,
  3,
  10,
  5,
  0,
  15,
  12,
  8,
  2,
  4,
  9,
  1,
  7,
  5,
  11,
  3,
  14,
  10,
  0,
  6,
  13,
);
var S2 = new Array(
  15,
  1,
  8,
  14,
  6,
  11,
  3,
  4,
  9,
  7,
  2,
  13,
  12,
  0,
  5,
  10,
  3,
  13,
  4,
  7,
  15,
  2,
  8,
  14,
  12,
  0,
  1,
  10,
  6,
  9,
  11,
  5,
  0,
  14,
  7,
  11,
  10,
  4,
  13,
  1,
  5,
  8,
  12,
  6,
  9,
  3,
  2,
  15,
  13,
  8,
  10,
  1,
  3,
  15,
  4,
  2,
  11,
  6,
  7,
  12,
  0,
  5,
  14,
  9,
);
var S3 = new Array(
  10,
  0,
  9,
  14,
  6,
  3,
  15,
  5,
  1,
  13,
  12,
  7,
  11,
  4,
  2,
  8,
  13,
  7,
  0,
  9,
  3,
  4,
  6,
  10,
  2,
  8,
  5,
  14,
  12,
  11,
  15,
  1,
  13,
  6,
  4,
  9,
  8,
  15,
  3,
  0,
  11,
  1,
  2,
  12,
  5,
  10,
  14,
  7,
  1,
  10,
  13,
  0,
  6,
  9,
  8,
  7,
  4,
  15,
  14,
  3,
  11,
  5,
  2,
  12,
);
var S4 = new Array(
  7,
  13,
  14,
  3,
  0,
  6,
  9,
  10,
  1,
  2,
  8,
  5,
  11,
  12,
  4,
  15,
  13,
  8,
  11,
  5,
  6,
  15,
  0,
  3,
  4,
  7,
  2,
  12,
  1,
  10,
  14,
  9,
  10,
  6,
  9,
  0,
  12,
  11,
  7,
  13,
  15,
  1,
  3,
  14,
  5,
  2,
  8,
  4,
  3,
  15,
  0,
  6,
  10,
  1,
  13,
  8,
  9,
  4,
  5,
  11,
  12,
  7,
  2,
  14,
);
var S5 = new Array(
  2,
  12,
  4,
  1,
  7,
  10,
  11,
  6,
  8,
  5,
  3,
  15,
  13,
  0,
  14,
  9,
  14,
  11,
  2,
  12,
  4,
  7,
  13,
  1,
  5,
  0,
  15,
  10,
  3,
  9,
  8,
  6,
  4,
  2,
  1,
  11,
  10,
  13,
  7,
  8,
  15,
  9,
  12,
  5,
  6,
  3,
  0,
  14,
  11,
  8,
  12,
  7,
  1,
  14,
  2,
  13,
  6,
  15,
  0,
  9,
  10,
  4,
  5,
  3,
);
var S6 = new Array(
  12,
  1,
  10,
  15,
  9,
  2,
  6,
  8,
  0,
  13,
  3,
  4,
  14,
  7,
  5,
  11,
  10,
  15,
  4,
  2,
  7,
  12,
  9,
  5,
  6,
  1,
  13,
  14,
  0,
  11,
  3,
  8,
  9,
  14,
  15,
  5,
  2,
  8,
  12,
  3,
  7,
  0,
  4,
  10,
  1,
  13,
  11,
  6,
  4,
  3,
  2,
  12,
  9,
  5,
  15,
  10,
  11,
  14,
  1,
  7,
  6,
  0,
  8,
  13,
);
var S7 = new Array(
  4,
  11,
  2,
  14,
  15,
  0,
  8,
  13,
  3,
  12,
  9,
  7,
  5,
  10,
  6,
  1,
  13,
  0,
  11,
  7,
  4,
  9,
  1,
  10,
  14,
  3,
  5,
  12,
  2,
  15,
  8,
  6,
  1,
  4,
  11,
  13,
  12,
  3,
  7,
  14,
  10,
  15,
  6,
  8,
  0,
  5,
  9,
  2,
  6,
  11,
  13,
  8,
  1,
  4,
  10,
  7,
  9,
  5,
  0,
  15,
  14,
  2,
  3,
  12,
);
var S8 = new Array(
  13,
  2,
  8,
  4,
  6,
  15,
  11,
  1,
  10,
  9,
  3,
  14,
  5,
  0,
  12,
  7,
  1,
  15,
  13,
  8,
  10,
  3,
  7,
  4,
  12,
  5,
  6,
  11,
  0,
  14,
  9,
  2,
  7,
  11,
  4,
  1,
  9,
  12,
  14,
  2,
  0,
  6,
  10,
  13,
  15,
  3,
  5,
  8,
  2,
  1,
  14,
  7,
  4,
  10,
  8,
  13,
  15,
  12,
  9,
  0,
  3,
  5,
  6,
  11,
);

//, first, key, permutation
var PC_1_perm = new Array(
  -1,
  // C subkey bits
  57,
  49,
  41,
  33,
  25,
  17,
  9,
  1,
  58,
  50,
  42,
  34,
  26,
  18,
  10,
  2,
  59,
  51,
  43,
  35,
  27,
  19,
  11,
  3,
  60,
  52,
  44,
  36,
  // D subkey bits
  63,
  55,
  47,
  39,
  31,
  23,
  15,
  7,
  62,
  54,
  46,
  38,
  30,
  22,
  14,
  6,
  61,
  53,
  45,
  37,
  29,
  21,
  13,
  5,
  28,
  20,
  12,
  4,
);

//, per-round, key, selection, permutation
var PC_2_perm = new Array(
  -1,
  14,
  17,
  11,
  24,
  1,
  5,
  3,
  28,
  15,
  6,
  21,
  10,
  23,
  19,
  12,
  4,
  26,
  8,
  16,
  7,
  27,
  20,
  13,
  2,
  41,
  52,
  31,
  37,
  47,
  55,
  30,
  40,
  51,
  45,
  33,
  48,
  44,
  49,
  39,
  56,
  34,
  53,
  46,
  42,
  50,
  36,
  29,
  32,
);

// save output in case we want to reformat it later
var DES_output = new Array(65);

// remove spaces from input
function remove_spaces(instr) {
  var i;
  var outstr = "";

  for (i = 0; i < instr.length; i++)
    if (instr.charAt(i) != " ")
      // not a space, include it
      outstr += instr.charAt(i);

  return outstr;
}

// split an integer into bits
// ary   = array to store bits in
// start = starting subscript
// bitc  = number of bits to convert
// val   = number to convert
function split_int(ary, start, bitc, val) {
  var i = start;
  var j;
  for (j = bitc - 1; j >= 0; j--) {
    // isolate low-order bit
    ary[i + j] = val & 1;
    // remove that bit
    val >>= 1;
  }
}

function get_plaintext(bitarray, str) {
  // Deprecated: now handled by get_value. This is a stub for compatibility.
  bitarray[0] = -1;
  return;
}

// get the message to encrypt/decrypt
function get_value(bitarray, str, isASCII, fieldName) {
  var i;
  var val; // one hex digit

  // insert note we probably are ok
  bitarray[0] = -1;

  if (isASCII) {
    // check length of data
    if (str.length != 8) {
      window.alert(
        (fieldName || "Input") +
          " must be exactly 8 ASCII characters when using ASCII mode.\nExample: ABCDEFGH",
      );
      bitarray[0] = ERROR_VAL;
      return;
    }

    // have ASCII data
    for (i = 0; i < 8; i++) {
      split_int(bitarray, i * 8 + 1, 8, str.charCodeAt(i));
    }
  } else {
    // have hex data - remove any spaces they used, then convert
    str = remove_spaces(str);

    // check length of data
    if (str.length != 16) {
      window.alert(
        (fieldName || "Input") +
          " must be exactly 16 hexadecimal digits.\nExample: 0123456789ABCDEF",
      );
      bitarray[0] = ERROR_VAL;
      return;
    }

    for (i = 0; i < 16; i++) {
      // get the next hex digit
      val = str.charCodeAt(i);

      // do some error checking
      if (val >= 48 && val <= 57)
        // have a valid digit 0-9
        val -= 48;
      else if (val >= 65 && val <= 70)
        // have a valid digit A-F
        val -= 55;
      else if (val >= 97 && val <= 102)
        // have a valid digit A-F
        val -= 87;
      else {
        // not 0-9 or A-F, complain
        window.alert(
          str.charAt(i) +
            " is not a valid hex digit in " +
            (fieldName || "input"),
        );
        bitarray[0] = ERROR_VAL;
        return;
      }

      // add this digit to the array
      split_int(bitarray, i * 4 + 1, 4, val);
    }
  }
}

// copy bits in a permutation
//   dest = where to copy the bits to
//   src  = Where to copy the bits from
//   perm = The order to copy/permute the bits
// note: since DES ingores x[0], we do also
function permute(dest, src, perm) {
  var i;
  var fromloc;

  for (i = 1; i < perm.length; i++) {
    fromloc = perm[i];
    dest[i] = src[fromloc];
  }
}

// do an array XOR
// assume all array entries are 0 or 1
function xor(a1, a2) {
  var i;

  for (i = 1; i < a1.length; i++) a1[i] = a1[i] ^ a2[i];
}

// process one S-Box, return integer from S-Box
function do_S(SBox, index, inbits) {
  // collect the 6 bits into a single integer
  var S_index =
    inbits[index] * 32 +
    inbits[index + 5] * 16 +
    inbits[index + 1] * 8 +
    inbits[index + 2] * 4 +
    inbits[index + 3] * 2 +
    inbits[index + 4];

  // do lookup
  return SBox[S_index];
}

// do one round of DES encryption
function des_round(L, R, KeyR) {
  var E_result = new Array(49);
  var S_out = new Array(33);

  // copy the existing L bits, then set new L = old R
  var temp_L = new Array(33);
  for (i = 0; i < 33; i++) {
    // copy exising L bits
    temp_L[i] = L[i];

    // set L = R
    L[i] = R[i];
  }

  // expand R using E permutation
  permute(E_result, R, E_perm);

  // exclusive-or with current key
  xor(E_result, KeyR);

  // put through the S-Boxes
  split_int(S_out, 1, 4, do_S(S1, 1, E_result));
  split_int(S_out, 5, 4, do_S(S2, 7, E_result));
  split_int(S_out, 9, 4, do_S(S3, 13, E_result));
  split_int(S_out, 13, 4, do_S(S4, 19, E_result));
  split_int(S_out, 17, 4, do_S(S5, 25, E_result));
  split_int(S_out, 21, 4, do_S(S6, 31, E_result));
  split_int(S_out, 25, 4, do_S(S7, 37, E_result));
  split_int(S_out, 29, 4, do_S(S8, 43, E_result));

  // do the P permutation
  permute(R, S_out, P_perm);

  // xor this with old L to get the new R
  xor(R, temp_L);
}

// shift the CD values left 1 bit
function shift_CD_1(CD) {
  var i;

  // note we use [0] to hold the bit shifted around the end
  for (i = 0; i <= 55; i++) CD[i] = CD[i + 1];

  // shift D bit around end
  CD[56] = CD[28];
  // shift C bit around end
  CD[28] = CD[0];
}

// shift the CD values left 2 bits
function shift_CD_2(CD) {
  var i;
  var C1 = CD[1];

  // note we use [0] to hold the bit shifted around the end
  for (i = 0; i <= 54; i++) CD[i] = CD[i + 2];

  // shift D bits around end
  CD[55] = CD[27];
  CD[56] = CD[28];
  // shift C bits around end
  CD[27] = C1;
  CD[28] = CD[0];
}

// do the actual DES encryption/decryption
function des_encrypt(inData, Key, do_encrypt) {
  var tempData = new Array(65); // output bits
  var CD = new Array(57); // halves of current key
  var KS = new Array(16); // per-round key schedules
  var L = new Array(33); // left half of current data
  var R = new Array(33); // right half of current data
  var result = new Array(65); // DES output
  var i;

  // do the initial key permutation
  permute(CD, Key, PC_1_perm);

  // create the subkeys
  for (i = 1; i <= 16; i++) {
    // create a new array for each round
    KS[i] = new Array(49);

    // how much should we shift C and D?
    if (i == 1 || i == 2 || i == 9 || i == 16) shift_CD_1(CD);
    else shift_CD_2(CD);

    // create the actual subkey
    permute(KS[i], CD, PC_2_perm);
  }

  // handle the initial permutation
  permute(tempData, inData, IP_perm);

  // split data into L/R parts
  for (i = 1; i <= 32; i++) {
    L[i] = tempData[i];
    R[i] = tempData[i + 32];
  }

  // encrypting or decrypting?
  if (do_encrypt) {
    // encrypting
    for (i = 1; i <= 16; i++) {
      des_round(L, R, KS[i]);
    }
  } else {
    // decrypting
    for (i = 16; i >= 1; i--) {
      des_round(L, R, KS[i]);
    }
  }

  // create the 64-bit preoutput block = R16/L16
  for (i = 1; i <= 32; i++) {
    // copy R bits into left half of block, L bits into right half
    tempData[i] = R[i];
    tempData[i + 32] = L[i];
  }

  // do final permutation and return result
  permute(result, tempData, FP_perm);
  return result;
}
// do encrytion/decryption
// do_encrypt is TRUE for encrypt, FALSE for decrypt
function do_des(do_encrypt) {
  var inData = new Array(65); // input message bits
  var Key = new Array(65);

  // Get input type (ASCII or Hex) from UI (assume radio button or dropdown with id 'inputType')
  var isASCII = document.getElementById("inputType").value === "ascii";

  if (!validatePartIIPlaintext()) {
    document.getElementsByName("outdata")[0].value = "";
    return;
  }

  if (!validateHexKeyField("key", "keyValidationError", "Key")) {
    document.getElementsByName("outdata")[0].value = "";
    return;
  }

  // Get the message from the user using get_value
  get_value(
    inData,
    document.getElementById("plaintext2").value,
    isASCII,
    "Plaintext",
  );
  if (inData[0] == ERROR_VAL) {
    return;
  }

  // Get the key from the user (always hex for DES)
  get_value(Key, document.getElementById("key").value, false, "Key");
  if (Key[0] == ERROR_VAL) {
    return;
  }

  // Do the encryption/decryption, put output in DES_output for display
  DES_output = des_encrypt(inData, Key, do_encrypt);
  document.getElementsByName("outdata")[0].value = format_bitstring(
    DES_output,
    8,
  );
}

// do Triple-DES encrytion/decryption
// do_encrypt is TRUE for encrypt, FALSE for decrypt
function do_tdes(do_encrypt) {
  var inData = new Array(65); // input message bits
  var tempdata = new Array(65); // interm result bits
  var KeyA = new Array(65);
  var KeyB = new Array(65);

  // Get input type (ASCII or Hex) from UI (assume radio button or dropdown with id 'inputType')
  var isASCII = document.getElementById("inputType").value === "ascii";

  if (!validatePartIIPlaintext()) {
    document.getElementById("tdesout").value = "";
    return;
  }

  if (!validateHexKeyField("keya", "keyAValidationError", "Key Part A")) {
    document.getElementById("tdesout").value = "";
    return;
  }

  if (!validateHexKeyField("keyb", "keyBValidationError", "Key Part B")) {
    document.getElementById("tdesout").value = "";
    return;
  }

  // Get the message from the user using get_value
  get_value(
    inData,
    document.getElementById("plaintext2").value,
    isASCII,
    "Plaintext",
  );
  if (inData[0] == ERROR_VAL) {
    return;
  }

  // Get the key part A from the user (always hex for DES)
  get_value(KeyA, document.getElementById("keya").value, false, "Key Part A");
  if (KeyA[0] == ERROR_VAL) {
    return;
  }

  // Get the key part B from the user (always hex for DES)
  get_value(KeyB, document.getElementById("keyb").value, false, "Key Part B");
  if (KeyB[0] == ERROR_VAL) {
    return;
  }

  if (do_encrypt) {
    // TDES encrypt = DES encrypt/decrypt/encrypt
    tempdata = des_encrypt(inData, KeyA, true);
    tempdata = des_encrypt(tempdata, KeyB, false);
    DES_output = des_encrypt(tempdata, KeyA, true);
  } else {
    // TDES decrypt = DES decrypt/encrypt/decrypt
    tempdata = des_encrypt(inData, KeyA, false);
    tempdata = des_encrypt(tempdata, KeyB, true);
    DES_output = des_encrypt(tempdata, KeyA, false);
  }

  return format_bitstring(DES_output, 8);
}

function randomKey(length) {
  var chars = "0123456789abcdef".split("");

  if (!length) {
    length = Math.floor(Math.random() * chars.length);
  }

  var str = "";
  for (var i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

function changeKeyA() {
  var newKey = randomKey(16);
  document.getElementById("keya").value = newKey;
  // Update configuration overview
  document.getElementById("currentKeyA").textContent = newKey;
}

function changeKeyB() {
  var newKey = randomKey(16);
  document.getElementById("keyb").value = newKey;
  // Update configuration overview
  document.getElementById("currentKeyB").textContent = newKey;
}

function changePlaintext() {
  var currentValue = remove_spaces(document.getElementById("plaintext").value);
  var userInput = window.prompt(
    "Enter exactly 64 binary digits (spaces optional). Leave empty to generate a random 64-bit message.",
    currentValue,
  );

  if (userInput === null) {
    return;
  }

  var cleanedInput = remove_spaces(userInput);

  if (cleanedInput === "") {
    cleanedInput = randomBinaryString(64);
  }

  var validation = validatePartIMessageBinary(cleanedInput);
  if (!validation.valid) {
    set_inline_error("plaintext", "messageValidationError", validation.message);
    return;
  }

  clear_inline_error("plaintext", "messageValidationError");
  applyPartIMessage(validation.cleaned);
}

function checkAnswer() {
  var user_answer = remove_spaces(document.getElementById("userans").value);
  var actual_answer = remove_spaces(do_tdes(true));
  var notification = document.getElementById("notification");

  if (user_answer == actual_answer) {
    notification.innerHTML = "🎉 CORRECT! Well done!";
    notification.className = "success";
    notification.style.display = "block";
    // Hide answer explanation if it was shown
    document.getElementById("answerExplanation").style.display = "none";
  } else {
    notification.innerHTML = "❌ Something is wrong... please try again!";
    notification.className = "error";
    notification.style.display = "block";
  }
}

// Reveal the correct answer with detailed explanation
function revealAnswer() {
  var correct_answer = remove_spaces(do_tdes(true));
  var keyA = document.getElementById("keya").value;
  var keyB = document.getElementById("keyb").value;
  var message = document.getElementById("plaintext").value;

  // Display the correct answer
  document.getElementById("correctAnswer").textContent = correct_answer;

  // Update explanation with current values
  var explanationDiv = document.getElementById("explanationText");
  explanationDiv.innerHTML = `
    <p><strong>Why this is correct:</strong></p>
    <p>This result comes from the Triple DES (3DES) encryption process using your current configuration:</p>
    <ul style="margin: 10px 0; padding-left: 20px;">
      <li><strong>Message:</strong> <code style="background: #f8f9fa; padding: 2px 4px; border-radius: 3px;">${message}</code></li>
      <li><strong>Key Part A:</strong> <code style="background: #f8f9fa; padding: 2px 4px; border-radius: 3px;">${keyA}</code></li>
      <li><strong>Key Part B:</strong> <code style="background: #f8f9fa; padding: 2px 4px; border-radius: 3px;">${keyB}</code></li>
    </ul>
    <p><strong>The 3DES Process:</strong></p>
    <ol style="margin: 10px 0; padding-left: 20px;">
      <li><strong>Step 1:</strong> DES Encrypt the message using Key Part A</li>
      <li><strong>Step 2:</strong> DES Decrypt the result from Step 1 using Key Part B</li>
      <li><strong>Step 3:</strong> DES Encrypt the result from Step 2 using Key Part A again</li>
    </ol>
    <p>The formula is: <strong>3DES(M) = DES<sub>KeyA</sub>(DES<sup>-1</sup><sub>KeyB</sub>(DES<sub>KeyA</sub>(M)))</strong></p>
    <p style="color: #155724; font-weight: 500;">💡 This three-step process provides stronger security than single DES by effectively using a longer key length and making brute-force attacks computationally infeasible.</p>
  `;

  // Show the explanation section
  document.getElementById("answerExplanation").style.display = "block";

  // Hide any existing notification
  document.getElementById("notification").style.display = "none";

  // Scroll to the explanation
  document
    .getElementById("answerExplanation")
    .scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Show TDES output in the simulation
function showTDES() {
  var tdes_output = do_tdes(true);
  document.getElementById("tdesout").value = tdes_output;
}

// Update input format guidance based on selected type
function updateInputFormat() {
  var inputType = document.getElementById("inputType").value;
  var plaintextInput = document.getElementById("plaintext2");
  var plaintextInfo = document.getElementById("plaintextInfo");

  if (inputType === "ascii") {
    plaintextInput.placeholder = "ABCDEFGH";
    plaintextInfo.title =
      "Enter your plaintext here. Example (ASCII): ABCDEFGH";
  } else {
    if (inputType === "binary") {
      plaintextInput.placeholder =
        "0101010101010101010101010101010101010101010101010101010101010101";
      plaintextInfo.title =
        "Enter your plaintext here. Example (Binary): 64 bits as 0/1";
    } else {
      plaintextInput.placeholder = "0123456789ABCDEF";
      plaintextInfo.title =
        "Enter your plaintext here. Example (Hex): 0123456789ABCDEF";
    }
  }

  validatePartIIPlaintext();
}

document.addEventListener("DOMContentLoaded", function () {
  initializePartIMessage();
  updateInputFormat();

  document
    .getElementById("plaintext2")
    .addEventListener("input", validatePartIIPlaintext);
  document.getElementById("key").addEventListener("input", function () {
    validateHexKeyField("key", "keyValidationError", "Key");
  });
});
